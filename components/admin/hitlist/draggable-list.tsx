"use client"

import { memo } from "react"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableSongRow } from "./sortable-song-row"
import { Song } from "@/types/hitlist"

interface DraggableListProps {
  id: string;
  songs: Song[];
  onDragEnd: (event: any) => void;
  handleDelete: (id: number) => void;
  showRankings?: boolean;
}

function DraggableListComponent({ id, songs, onDragEnd, handleDelete, showRankings }: DraggableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={onDragEnd}
      id={id}
    >
      <SortableContext items={songs} strategy={verticalListSortingStrategy}>
        <div className="divide-y divide-[#222]">
          {songs.map((song, index) => (
            <SortableSongRow 
              key={song.id} 
              song={song} 
              handleDelete={handleDelete}
              index={showRankings ? index : undefined}
              showVotes={showRankings}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default memo(DraggableListComponent)