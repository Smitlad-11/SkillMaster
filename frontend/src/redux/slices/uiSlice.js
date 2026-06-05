// redux/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: localStorage.getItem('theme') === 'dark',
    sidebarOpen: true,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', state.darkMode)
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
  },
})

export const { toggleDarkMode, toggleSidebar } = uiSlice.actions
export default uiSlice.reducer
