export default function OfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-screen overflow-hidden bg-[#2c2c3a]">
      {children}
    </div>
  )
}
