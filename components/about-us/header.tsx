interface HeaderComponentProps {
  title: string
  description?: string
}

export function HeaderComponent({ title, description }: HeaderComponentProps) {
  const words = title.trim().split(" ")
  const lastWord = words.pop()
  const leadingWords = words.join(" ")

  return (
    <div className="flex w-full flex-col items-center justify-center text-center">
      <h2 className="mb-4 font-kenyan text-4xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl">
        {leadingWords && <>{leadingWords} </>}
        <span className="text-[#569429]">{lastWord}</span>
      </h2>
      {description && (
        <p className="max-w-2xl text-center font-secondary text-base text-[#a8a8a8] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}