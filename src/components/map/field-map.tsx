"use client";

import dynamic from "next/dynamic";

const FieldMapClient = dynamic(() => import("@/components/map/field-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-[1.75rem] border border-khidkee-earth/10 bg-khidkee-mist text-sm text-khidkee-earth/70">
      Loading the field map...
    </div>
  )
});

export { FieldMapClient as FieldMap };
