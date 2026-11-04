import type { BgKey, CharId } from "./assets";

export type Pos = "left" | "center" | "right";
export interface OnStage { id: CharId; pos: Pos }

export interface Step {
  /** troca de cenário (fica até a próxima troca) */
  bg?: BgKey;
  /** quem está em cena (fica até ser trocado) */
  chars?: OnStage[];
  /** nome na caixa; sem nome = narração do Nhango */
  speaker?: string;
  text: string;
  /** atitude/ação mostrada como rubrica */
  act?: string;
  fx?: "shake" | "hop";
}

export interface PhoneMsg { from: "me" | "them" | "sys"; text: string; time?: string }

export type Book = "I" | "II" | "III";

interface PhaseBase { id: string; book: Book; title: string; day: string; summary: string }
export interface ScenePhase extends PhaseBase { kind: "scene"; steps: Step[] }
export interface PhonePhase extends PhaseBase { kind: "phone"; contact: string; messages: PhoneMsg[] }
export type Phase = ScenePhase | PhonePhase;
