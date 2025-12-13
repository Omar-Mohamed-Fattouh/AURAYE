// import { createSlice } from "@reduxjs/toolkit";
// import * as jwtDecode from "jwt-decode";

// const token = localStorage.getItem("token");

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     token: token || null,
//     user: token ? jwtDecode(token) : null,
//   },
//   reducers: {
//     setAuth: (state, action) => {
//       state.token = action.payload;
//       state.user = jwtDecode(action.payload);
//       localStorage.setItem("token", action.payload);
//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem("token");
//     },
//   },
// });

// export const { setAuth, logout } = authSlice.actions;
// export default authSlice.reducer;
