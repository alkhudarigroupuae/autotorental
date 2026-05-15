export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20" role="status">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-blue rounded-full animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
