import { Piece } from "#game/piece";
import { describe, expect, it } from "bun:test";

describe("Piece", () => {
  describe("new Piece", () => {
    it("should create an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.type).toBe("empty");
    });

    it("should create a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.type).toBe("piece");
      expect(piece.color).toBe("white");
      expect(piece.variant).toBe("default");
    });
  });

  describe("Piece.label", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.label).toBe("EMPTY");
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.label).toBe("WHITE");
    });
  });

  describe("Piece.toString", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.toString()).toBeString();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.toString()).toBeString();
    });
  });

  describe("Piece.isEmpty", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.isEmpty()).toBeTrue();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.isEmpty()).toBeFalse();
    });
  });

  describe("Piece.isWhite", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.isWhite()).toBeFalse();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.isWhite()).toBeTrue();
    });

    it("should handle a black piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "black",
        variant: "default",
      });
      expect(piece.isWhite()).toBeFalse();
    });
  });

  describe("Piece.isOwnPiece", () => {
    it("should handle an empty piece", () => {
      const piece = new Piece({ type: "empty" });
      expect(piece.isOwnPiece("white")).toBeFalse();
    });

    it("should handle a white piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "white",
        variant: "default",
      });
      expect(piece.isOwnPiece("white")).toBeTrue();
      expect(piece.isOwnPiece("black")).toBeFalse();
    });

    it("should handle a black piece", () => {
      const piece = new Piece({
        type: "piece",
        color: "black",
        variant: "default",
      });
      expect(piece.isOwnPiece("white")).toBeFalse();
      expect(piece.isOwnPiece("black")).toBeTrue();
    });
  });

  describe("Piece.fromLabel", () => {
    it("should create an empty piece", () => {
      const piece = Piece.fromLabel("EMPTY");
      expect(piece.type).toBe("empty");
    });

    it("should create a white piece", () => {
      const piece = Piece.fromLabel("WHITE");
      expect(piece.type).toBe("piece");
      expect(piece.color).toBe("white");
      expect(piece.variant).toBe("default");
    });

    it("should create a black crowned piece", () => {
      const piece = Piece.fromLabel("BLACK:CROWNED");
      expect(piece.type).toBe("piece");
      expect(piece.color).toBe("black");
      expect(piece.variant).toBe("crowned");
    });
  });
});
