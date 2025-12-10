import React from "react"

const Playlist: React.FC = () => {
  return (
    <div className="playlist-container text-white">
        {/* EMBED */}
        <div className="border-3 border-white dark:border-black rounded-2xl">
            <iframe
                className="rounded-xl w-[365px] h-[500px]"
                src="https://open.spotify.com/embed/playlist/2ov85DmRexbvr1KXR8IsSf?utm_source=generator&theme=1"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </div>
    </div>
  );
};

export default Playlist;
