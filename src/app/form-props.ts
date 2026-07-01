import { createMetadataKey } from "@angular/forms/signals";

export const FIELD_INFO = createMetadataKey<string>()
export const FIELD_WARN = createMetadataKey<string | null>()
