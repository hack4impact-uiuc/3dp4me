import { OmitDeep } from "./omitDeep";

export type Unsaved<T> = OmitDeep<T, "_id">