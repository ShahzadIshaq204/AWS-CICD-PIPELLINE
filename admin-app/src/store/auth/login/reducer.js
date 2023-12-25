import { UPDATE_PROFIL } from "./actionTypes";

const initialState = {
  token: null, //localStorage.getItem("token"),
  errors: null,
  isLoading: false,
  user: localStorage.getItem("auth-user")
    ? JSON.parse(localStorage.getItem("auth-user"))
    : null,
  isAuthenticated: localStorage.getItem("auth-user") ? true : false, // todo fixme
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case "AUTH_SUCCESS":
      localStorage.setItem("auth-user", JSON.stringify(action.payload?.user));
      return {
        ...state,
        errors: null,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload?.user,
        // token: action.payload?.token,
      };

    // case AUTH_LOADING:
    //   return {
    //     ...state,
    //     isLoading: true,
    //   };
    // case STOP_AUTH_LOADING:
    //   return {
    //     ...state,
    //     isLoading: false,
    //   };

    // case USER_LOADED:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     isAuthenticated: true,
    //     user: {
    //       ...action.payload,
    //       // role: { ...action.payload.role, name: "Customer" }, // Just for litiges
    //     },
    //     errors: null,
    //   };

    // case LOGIN_SUCCESS:
    //   localStorage.setItem("token", action.payload?.token);
    //   return {
    //     ...state,
    //     isAuthenticated: true,
    //     token: action.payload?.token,
    //     isLoading: false,
    //     user: action.payload?.user,
    //     errors: null,
    //   };

    // case ADD_SHOP:
    //   return {
    //     ...state,
    //     user: { ...state.user, shop: action.payload },
    //   };

    // case UPDATE_SHOP:
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       shop: { ...state.user.shop, ...action.payload },
    //     },
    //   };

    case UPDATE_PROFIL:
      const { first_name, last_name, username } = action.payload;
      localStorage.setItem(
        "auth-user",
        JSON.stringify({
          ...state.user,
          first_name,
          last_name,
          username,
        })
      );

      return {
        ...state,
        user: {
          ...state.user,
          first_name,
          last_name,
          username,
        },
      };

    // case VALIDATE_CODE_SMS:
    //   return { ...state, user: { ...state.user, active: 1 } };
    // case AUTH_ERROR:
    // case LOGIN_FAIL:
    //   localStorage.removeItem("token");

    //   return {
    //     ...state,
    //     isAuthenticated: false,
    //     token: null,
    //     isLoading: false,
    //     user: null,
    //     errors: action.payload,
    //   };

    // case LOGOUT:
    //   localStorage.removeItem("token");
    //   return initialState;

    default:
      return state;
  }
}

/*const updateListbyId = (updated, listData) => {
  return listData.map((item) => {
    if (updated.id === item.id) {
      return updated;
    } else {
      return item;
    }
  });
};*/
