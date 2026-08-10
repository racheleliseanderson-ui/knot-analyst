/**
 * Selected tying videos — one per knot, merged into the catalog at load.
 * Nothing here loads until the reader presses play (see VideoEmbed).
 */
import type { KnotContent, KnotVideo } from "@/domain/types";

export const KNOT_VIDEOS: Record<string, KnotVideo> = {
  palomar: {
    provider: "youtube",
    id: "JY4ZLtuG3fg",
    title: "How to tie the Palomar Knot (and when NOT to use it)",
    channel: "Just The Lip Fishing",
  },
  "improved-clinch": {
    provider: "youtube",
    id: "2YO7JWNdVC0",
    title: "How to Tie the Improved Clinch Knot",
    channel: "Fishing with Nat",
  },
  "uni-knot": {
    provider: "youtube",
    id: "-xubtzqhXUA",
    title: "How to tie the Uni Knot",
    channel: "Just The Lip Fishing",
  },
  fg: {
    provider: "youtube",
    id: "ZPTzkep9xlI",
    title: "Easiest way to tie the FG Knot (braid to leader)",
    channel: "Salt Strong",
  },
  "bimini-twist": {
    provider: "youtube",
    id: "jahddqzKhLY",
    title: "How to tie a Bimini Twist",
    channel: "StokedOnFishing",
  },
  "non-slip-mono-loop": {
    provider: "youtube",
    id: "yT5kC35LVIk",
    title: "How to tie a Non-Slip Loop Knot",
    channel: "Fishing with Nat",
  },
  "double-uni": {
    provider: "youtube",
    id: "6VgQLBpwJUY",
    title: "Double Uni Knot — braid to fluorocarbon or mono",
    channel: "Fishthatwontquit",
  },
  alberto: {
    provider: "youtube",
    id: "zrVzp0n2gAw",
    title: "Alberto Knot — braid to fluorocarbon or mono",
    channel: "Fishthatwontquit",
  },
  "perfection-loop": {
    provider: "youtube",
    id: "bYAPQDDmKs4",
    title: "How to tie the Perfection Loop",
    channel: "WhyKnot",
  },
  "san-diego-jam": {
    provider: "youtube",
    id: "eiKjTJAfT74",
    title: "How to tie a San Diego Jam Knot",
    channel: "Fishing with Nat",
  },
  surgeons: {
    provider: "youtube",
    id: "Tmz25DTGgnk",
    title: "How to tie a Surgeon's Knot",
    channel: "Ashland Fly Shop",
  },
  blood: {
    provider: "youtube",
    id: "Q0afkYn8vT8",
    title: "How to tie a Blood Knot",
    channel: "WhyKnot",
  },
  "dropper-loop": {
    provider: "youtube",
    id: "c0Q57HrnHLk",
    title: "How to tie the Dropper Loop",
    channel: "Dieter Melhorn Fishing",
  },
  "arbor-knot": {
    provider: "youtube",
    id: "y1d0LikjiC4",
    title: "How to tie the Arbor Knot — line to spool",
    channel: "Fishing Tutorials",
  },
};

export function applyVideo(content: KnotContent): KnotContent {
  const video = KNOT_VIDEOS[content.id];
  return video ? { ...content, video } : content;
}