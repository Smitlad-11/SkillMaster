// components/ProgressBar.jsx
const ProgressBar = ({ percentage, showLabel = true }) => (
  <div className="w-full">
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className="bg-primary-600 h-3 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
    {showLabel && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{percentage}% Complete</p>}
  </div>
)

export default ProgressBar
