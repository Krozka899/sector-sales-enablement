function BrandMark({ inverted = false }) {
  return (
    <span
      aria-hidden="true"
      className={`relative grid size-9 shrink-0 place-items-center rounded-full ${
        inverted ? 'bg-white' : 'bg-[#e60000]'
      }`}
    >
      <span
        className={`absolute size-[18px] rounded-full border-[3px] ${
          inverted ? 'border-[#e60000]' : 'border-white'
        }`}
      />
      <span
        className={`absolute -right-px top-1 size-3 rounded-full ${
          inverted ? 'bg-[#e60000]' : 'bg-white'
        }`}
      />
    </span>
  )
}

export default BrandMark
