import nhango from "@/assets/char-nhango.png";
import iry from "@/assets/char-iry.png";
import nery from "@/assets/char-nery.png";
import kiro from "@/assets/char-kiro.png";
import davo from "@/assets/char-davo.png";
import heibo from "@/assets/char-heibo.png";
import celula from "@/assets/bg-celula.jpg";
import ebf from "@/assets/bg-ebf.jpg";
import campo from "@/assets/bg-campo.jpg";
import rua from "@/assets/bg-rua.jpg";
import sala from "@/assets/bg-sala.jpg";
import patio from "@/assets/bg-patio.jpg";
import video from "@/assets/bg-video.jpg";
import quarto from "@/assets/bg-quarto.jpg";

export const SPRITES = { nhango, iry, nery, kiro, davo, heibo } as const;
export type CharId = keyof typeof SPRITES;

export const BGS = { celula, ebf, campo, rua, sala, patio, video, quarto } as const;
export type BgKey = keyof typeof BGS;
