import type { Actions, State } from './types'
import { message, useNuxtApp } from '#imports'

export function useGlobalActions(state: State): Actions {
  /** Sign out by deleting the token from localStorage */
  const signOut: Actions['signOut'] = () => {
    state.token.value = null
    state.user.value = null
  }

  /** Sign in by setting the token in localStorage */
  const signIn: Actions['signIn'] = async (newToken) => {
    state.token.value = newToken

    if (state.jwtPayload.value) {
      state.user.value = {
        id: state.jwtPayload.value.id,
        email: state.jwtPayload.value.email,
        firstname: state.jwtPayload.value.firstname,
        lastname: state.jwtPayload.value.lastname,
        roles: state.jwtPayload.value.roles,
      }
    }
  }

  /** manually try to refresh token */
  const refreshToken = async () => {
    const nuxtApp = useNuxtApp()
    const t = nuxtApp.vueApp.i18n.global.t

    nuxtApp.$api.instance
      .post('/auth/token/refresh', null, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data?.token) {
          signIn(response.data.token)
        }
      })
      .catch((err) => {
        message.error(err.message || t('msg.error.youHaveBeenSignedOut'))
        signOut()
      })
  }

  return { signIn, signOut, refreshToken }
}
