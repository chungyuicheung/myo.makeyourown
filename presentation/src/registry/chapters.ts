import type { ChapterDef } from "./types";
import Coldopen from "../chapters/01-coldopen/Coldopen";
import { narrations as coldopenNarrations } from "../chapters/01-coldopen/narrations";
import TitleMeaning from "../chapters/02-title-meaning/TitleMeaning";
import { narrations as titleMeaningNarrations } from "../chapters/02-title-meaning/narrations";
import FiveAggregates from "../chapters/03-five-aggregates/FiveAggregates";
import { narrations as fiveAggregatesNarrations } from "../chapters/03-five-aggregates/narrations";
import CoreTeaching from "../chapters/04-core-teaching/CoreTeaching";
import { narrations as coreTeachingNarrations } from "../chapters/04-core-teaching/narrations";
import EmptinessMeaning from "../chapters/05-emptiness-meaning/EmptinessMeaning";
import { narrations as emptinessMeaningNarrations } from "../chapters/05-emptiness-meaning/narrations";
import Liberation from "../chapters/06-liberation/Liberation";
import { narrations as liberationNarrations } from "../chapters/06-liberation/narrations";
import Mantra from "../chapters/07-mantra/Mantra";
import { narrations as mantraNarrations } from "../chapters/07-mantra/narrations";
import Closing from "../chapters/08-closing/Closing";
import { narrations as closingNarrations } from "../chapters/08-closing/narrations";

/**
 * Order = order of presentation.
 *
 * Each chapter MUST provide a `narrations: Narration[]` array. Its length
 * is the chapter's step count — there is no `totalSteps` to maintain
 * separately. This guarantees the audio synthesis pipeline, the runtime
 * stepper, and the chapter `.tsx` switch on `step` cannot drift apart.
 *
 * Visual styling (color, fonts) comes entirely from the active theme —
 * chapters never hard-code palette / font names. See THEMES.md.
 */
export const CHAPTERS: ChapterDef[] = [
  {
    id: "coldopen",
    title: "開場鉤子",
    narrations: coldopenNarrations,
    Component: Coldopen,
  },
  {
    id: "title-meaning",
    title: "名字的含義",
    narrations: titleMeaningNarrations,
    Component: TitleMeaning,
  },
  {
    id: "five-aggregates",
    title: "五蘊是什麼",
    narrations: fiveAggregatesNarrations,
    Component: FiveAggregates,
  },
  {
    id: "core-teaching",
    title: "色即是空",
    narrations: coreTeachingNarrations,
    Component: CoreTeaching,
  },
  {
    id: "emptiness-meaning",
    title: "性空與緣起",
    narrations: emptinessMeaningNarrations,
    Component: EmptinessMeaning,
  },
  {
    id: "liberation",
    title: "解脫之道",
    narrations: liberationNarrations,
    Component: Liberation,
  },
  {
    id: "mantra",
    title: "咒語與結語",
    narrations: mantraNarrations,
    Component: Mantra,
  },
  {
    id: "closing",
    title: "結語",
    narrations: closingNarrations,
    Component: Closing,
  },
];
