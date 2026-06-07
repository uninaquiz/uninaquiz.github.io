import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useQuizSession } from "./use-quiz-session";
import { makeQuestion } from "@/test/factories/quiz.factory";

describe("useQuizSession", () => {
  it("initialises with score 0 and all answers null", () => {
    const questions = [makeQuestion(), makeQuestion()];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    expect(result.current.score).toBe(0);
    expect(result.current.answers).toEqual([null, null]);
    expect(result.current.finished).toBe(false);
  });

  it("increments score when correct option selected", () => {
    const questions = [makeQuestion({ correctIndex: 1 })];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    act(() => result.current.selectOption(1));
    expect(result.current.score).toBe(1);
    expect(result.current.answers[0]?.correct).toBe(true);
  });

  it("does not increment score on wrong answer", () => {
    const questions = [makeQuestion({ correctIndex: 0 })];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    act(() => result.current.selectOption(3));
    expect(result.current.score).toBe(0);
    expect(result.current.answers[0]?.correct).toBe(false);
  });

  it("ignores second selectOption after answer is locked", () => {
    const questions = [makeQuestion({ correctIndex: 0 })];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    act(() => result.current.selectOption(0));
    act(() => result.current.selectOption(1));
    expect(result.current.score).toBe(1);
    expect(result.current.answers[0]?.selected).toBe(0);
  });

  it("advances qIndex on advance(1)", () => {
    const questions = [makeQuestion(), makeQuestion()];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    act(() => result.current.selectOption(0));
    act(() => { result.current.advance(1); });
    expect(result.current.qIndex).toBe(1);
  });

  it("returns HistoryItem and sets finished on last advance", () => {
    const questions = [makeQuestion({ correctIndex: 0 })];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Ciências", "hard")
    );
    act(() => result.current.selectOption(0));
    let historyItem: ReturnType<typeof result.current.advance> = null;
    act(() => { historyItem = result.current.advance(1); });
    expect(result.current.finished).toBe(true);
    expect(historyItem).not.toBeNull();
    expect(historyItem?.topic).toBe("Ciências");
    expect(historyItem?.difficulty).toBe("hard");
    expect(historyItem?.score).toBe(1);
    expect(historyItem?.total).toBe(1);
  });

  it("does not go below index 0 on advance(-1)", () => {
    const questions = [makeQuestion(), makeQuestion()];
    const { result } = renderHook(() =>
      useQuizSession(questions, "Matemática", "easy")
    );
    act(() => { result.current.advance(-1); });
    expect(result.current.qIndex).toBe(0);
  });
});
