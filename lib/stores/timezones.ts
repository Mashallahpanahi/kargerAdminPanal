export interface Timezone {
  name: string;
  abbreviation: string;
  utc_offset: string;
  regions: string[];
}

export const US_TIMEZONES: Timezone[] = [
  {
    name: "Eastern Standard Time",
    abbreviation: "EST",
    utc_offset: "-05:00",
    regions: ["New York", "Florida", "Georgia", "Ohio"],
  },
  {
    name: "Eastern Daylight Time",
    abbreviation: "EDT",
    utc_offset: "-04:00",
    regions: ["Same as EST states during Daylight Saving"],
  },
  {
    name: "Central Standard Time",
    abbreviation: "CST",
    utc_offset: "-06:00",
    regions: ["Texas", "Illinois", "Wisconsin", "Louisiana"],
  },
  {
    name: "Central Daylight Time",
    abbreviation: "CDT",
    utc_offset: "-05:00",
    regions: ["Same as CST states during Daylight Saving"],
  },
  {
    name: "Mountain Standard Time",
    abbreviation: "MST",
    utc_offset: "-07:00",
    regions: ["Arizona", "Colorado", "Utah", "New Mexico"],
  },
  {
    name: "Mountain Daylight Time",
    abbreviation: "MDT",
    utc_offset: "-06:00",
    regions: ["Same as MST states during Daylight Saving"],
  },
  {
    name: "Pacific Standard Time",
    abbreviation: "PST",
    utc_offset: "-08:00",
    regions: ["California", "Washington", "Oregon", "Nevada"],
  },
  {
    name: "Pacific Daylight Time",
    abbreviation: "PDT",
    utc_offset: "-07:00",
    regions: ["Same as PST states during Daylight Saving"],
  },
  {
    name: "Alaska Standard Time",
    abbreviation: "AKST",
    utc_offset: "-09:00",
    regions: ["Most of Alaska"],
  },
  {
    name: "Alaska Daylight Time",
    abbreviation: "AKDT",
    utc_offset: "-08:00",
    regions: ["Most of Alaska during Daylight Saving"],
  },
  {
    name: "Hawaii-Aleutian Standard Time",
    abbreviation: "HST",
    utc_offset: "-10:00",
    regions: ["Hawaii", "Parts of Aleutian Islands"],
  },
  {
    name: "Hawaii-Aleutian Daylight Time",
    abbreviation: "HDT",
    utc_offset: "-09:00",
    regions: ["Used only in some Aleutian Islands"],
  },
  {
    name: "Chamorro Standard Time",
    abbreviation: "CHST",
    utc_offset: "+10:00",
    regions: ["Guam", "Northern Mariana Islands"],
  },
  {
    name: "Atlantic Standard Time",
    abbreviation: "AST",
    utc_offset: "-04:00",
    regions: ["Puerto Rico", "U.S. Virgin Islands"],
  },
  {
    name: "Samoa Standard Time",
    abbreviation: "SST",
    utc_offset: "-11:00",
    regions: ["American Samoa"],
  },
];
// Helper function to get timezone display name for UI
export const getTimezoneDisplayName = (timezone: Timezone): string => {
  return `${timezone.name} (${timezone.abbreviation}) - UTC${
    timezone.utc_offset
  } - ${timezone.regions.join(", ")}`;
};

// Helper function to format timezone as string for backend
export const formatTimezoneForBackend = (timezone: Timezone): string => {
  // Use the same format that parseTimezoneFromBackend expects
  return `${timezone.name}(${timezone.abbreviation})- UTC${
    timezone.utc_offset
  }-${timezone.regions.join(",")}`;
};

// Helper function to parse timezone from backend string
export const parseTimezoneFromBackend = (
  timezoneString: string
): Timezone | null => {
  try {
    // Check if the string is already in the pipe-separated format
    if (timezoneString.includes("|")) {
      const parts = timezoneString.split("|");
      if (parts.length >= 4) {
        return {
          name: parts[0],
          abbreviation: parts[1],
          utc_offset: parts[2],
          regions: parts[3] ? parts[3].split(",") : [],
        };
      }
    }

    // If it's not in the expected format, try to find a matching timezone by name
    const foundTimezone = US_TIMEZONES.find(
      (tz) =>
        timezoneString.includes(tz.name) ||
        timezoneString.includes(tz.abbreviation)
    );

    return foundTimezone || null;
  } catch {
    return null;
  }
};

// Helper function to stringify timezone for Select component
export const stringifyTimezone = (timezone: Timezone): string => {
  return JSON.stringify(timezone);
};

// Helper function to parse timezone from Select value
export const parseTimezone = (timezoneString: string): Timezone | null => {
  try {
    return JSON.parse(timezoneString);
  } catch {
    return null;
  }
};
