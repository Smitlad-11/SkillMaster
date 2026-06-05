// redux/slices/courseSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (params, thunkAPI) => {
  try {
    const query = new URLSearchParams(params).toString()
    const { data } = await api.get(`/courses?${query}`)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message)
  }
})

export const fetchCourse = createAsyncThunk('courses/fetchOne', async (id, thunkAPI) => {
  try {
    const { data } = await api.get(`/courses/${id}`)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message)
  }
})

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [], course: null, total: 0, pages: 1,
    loading: false, error: null
  },
  reducers: { clearCourse: (state) => { state.course = null } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (s) => { s.loading = true })
      .addCase(fetchCourses.fulfilled, (s, a) => {
        s.loading = false; s.courses = a.payload.courses;
        s.total = a.payload.total; s.pages = a.payload.pages;
      })
      .addCase(fetchCourses.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(fetchCourse.pending, (s) => { s.loading = true })
      .addCase(fetchCourse.fulfilled, (s, a) => { s.loading = false; s.course = a.payload })
      .addCase(fetchCourse.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { clearCourse } = courseSlice.actions
export default courseSlice.reducer
