import { BLACK, Chess, WHITE } from "chess.js";
import { WebSocket } from "ws";
import { z } from "zod";
import { INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();

    // send the initial board to both players
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          startTime: this.startTime,
        },
      })
    );

    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          startTime: this.startTime,
        },
      })
    );
  }

  makeMove(
    socket: WebSocket,
    move: {
      from: string;
      to: string;
    }
  ) {
    // validate the type of move using zod
    const MoveSchema = z.object({
      from: z.string(),
      to: z.string(),
    });
    try {
      MoveSchema.parse(move);
    } catch (e) {
      console.log("ZODERROR: Invalid type of move", move);
      console.log(e);
      return;
    }

    // check if it is the player's turn
    if (this.board.turn() === WHITE && socket !== this.player1) {
      return;
    }

    if (this.board.turn() === BLACK && socket !== this.player2) {
      return;
    }

    // Make the move
    // move is valid or not is checked internally by the library
    try {
      this.board.move(move);
    } catch (error) {
      // send an error message to the player
      console.log(error);
      return;
    }

    // check if the game is over
    // check for win
    // check for draw
    // Checkmate, stalemate etc.
    if (this.board.isGameOver()) {
      // send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: "GAME_OVER",
          payload: {
            result: this.board.turn() === WHITE ? "BLACK_WON" : "WHITE_WON",
          },
        })
      );
      this.player2.send(
        JSON.stringify({
          type: "GAME_OVER",
          payload: {
            result: this.board.turn() === WHITE ? "BLACK_WON" : "WHITE_WON",
          },
        })
      );
    }

    // send the updated board to both players
    this.player1.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );

    this.player2.send(
      JSON.stringify({
        type: MOVE,
        payload: move,
      })
    );

    console.log("Move made:", move);
    console.log("Move count: ", this.board.moveNumber());
    console.log("Next Turn: ", this.board.turn());
  }
}
