import { InlineKeyboard } from "grammy";

import { Piece, type PieceLabel } from "./piece";

export type PieceLabels = readonly (readonly PieceLabel[])[];
export type BoardCells = readonly Piece[][];

type MoveInfo =
  | {
      readonly type: "invalid";
      readonly reason:
        | "from_empty"
        | "to_occupied"
        | "invalid_distance"
        | "invalid_victim";
    }
  | { readonly type: "step" }
  | {
      readonly type: "capture";
      readonly victim: { readonly row: number; readonly col: number };
    };

export class Board {
  readonly #cells: BoardCells;
  constructor(labels?: PieceLabels) {
    if (labels) {
      this.#cells = labels.map((row) => row.map((label) => Piece.from(label)));
      return;
    }

    this.#cells = Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => {
        if ((r + c) % 2 === 0) return Piece.from("EMPTY");
        return Piece.from(r < 3 ? "BLACK" : r > 4 ? "WHITE" : "EMPTY");
      }),
    );
  }

  toJSON(): BoardCells {
    return this.#cells;
  }

  static fromJSON(board: string): Board {
    const labels: PieceLabels = JSON.parse(board);
    return new Board(labels);
  }

  getPiece(row: number, col: number): Piece {
    const piece = this.#cells[row]?.[col];
    if (!piece) throw new Error("Piece not found");
    return piece;
  }

  setPiece(row: number, col: number, piece: Piece): void {
    if (!this.#cells[row]?.[col]) throw new Error("Cell not found");
    this.#cells[row][col] = piece;
  }

  render(gameId: number): InlineKeyboard {
    const keyboard = new InlineKeyboard();
    this.#cells.forEach((row, r) => {
      row.forEach((cell, c) => {
        keyboard.text(cell.toString(), `move:${gameId}:${r}:${c}`);
      });
      keyboard.row();
    });
    return keyboard;
  }

  getMoveInfo({
    fromRow,
    fromCol,
    toRow,
    toCol,
  }: {
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
  }): MoveInfo {
    const piece = this.getPiece(fromRow, fromCol);
    if (piece.isEmpty()) return { type: "invalid", reason: "from_empty" };

    const toPiece = this.getPiece(toRow, toCol);
    if (!toPiece.isEmpty()) {
      return { type: "invalid", reason: "to_occupied" };
    }

    const dr = toRow - fromRow;
    const dc = toCol - fromCol;

    // Must be diagonal and not the same square
    if (Math.abs(dr) !== Math.abs(dc) || (dr === 0 && dc === 0)) {
      return { type: "invalid", reason: "invalid_distance" };
    }

    const distance = Math.abs(dr);
    const dirR = Math.sign(dr);
    const dirC = Math.sign(dc);

    // Scan the path between from and to (exclusive)
    let victim: { row: number; col: number } | null = null;
    let hasVictim = false;

    for (let i = 1; i < distance; i++) {
      const checkRow = fromRow + i * dirR;
      const checkCol = fromCol + i * dirC;
      const checkPiece = this.getPiece(checkRow, checkCol);

      if (!checkPiece.isEmpty()) {
        // Must be an opponent
        if (!checkPiece.isOfOppositeColor(piece)) {
          return { type: "invalid", reason: "invalid_victim" };
        }

        // Only one victim allowed per line (flying kings capture one per jump)
        if (hasVictim) {
          return { type: "invalid", reason: "invalid_distance" };
        }

        hasVictim = true;
        victim = { row: checkRow, col: checkCol };
      }
    }

    const isCrowned = piece.isCrowned();

    if (!hasVictim) {
      if (isCrowned) {
        // Kings can slide any distance diagonally in any direction if path is clear
        return { type: "step" };
      }

      // Regular pieces: only one square forward
      if (distance === 1) {
        const forwardDir = piece.isOfColor("white") ? -1 : 1;
        if (dirR === forwardDir) {
          return { type: "step" };
        }
      }
      return { type: "invalid", reason: "invalid_distance" };
    }

    // Regular pieces can only short-jump (distance 2); kings can long-jump
    if (isCrowned || distance === 2) {
      if (!victim) {
        return { type: "invalid", reason: "invalid_victim" };
      }
      return { type: "capture", victim };
    }

    return { type: "invalid", reason: "invalid_distance" };
  }
}
