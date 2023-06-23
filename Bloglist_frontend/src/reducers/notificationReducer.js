import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notiSlice = createSlice({
  name: 'noti',
  initialState,
  reducers: {
    updateNotification(state, action) {
      const message  = action.payload
      return message
    },
    resetNotification() {
      return ''
    }
  }
})

export const { updateNotification, resetNotification } = notiSlice.actions

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(updateNotification(message))
    setTimeout(() => {
      dispatch(resetNotification())
    }, time)
  }
}


export default notiSlice.reducer