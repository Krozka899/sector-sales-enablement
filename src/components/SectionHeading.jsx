function SectionHeading({ eyebrow, title, description, align = 'left', light = false }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : ''

  return (
    <div className={`max-w-3xl ${alignment}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-xs font-bold tracking-[0.2em] uppercase ${
            light ? 'text-red-300' : 'text-[#d90000]'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-3xl font-bold tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem] lg:leading-tight ${
          light ? 'text-white' : 'text-[#1b1b1b]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-7 sm:text-lg xl:mt-3 2xl:mt-4 ${light ? 'text-white/70' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
