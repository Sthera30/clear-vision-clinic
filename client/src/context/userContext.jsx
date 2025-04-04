import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const UserContext = createContext()


export function UserContextProvider({ children }) {

  const [user, setUser] = useState(null)


  useEffect(() => {

    async function handle_fetch() {

      try {

        const res = await axios("http://localhost:5000/getUser", { withCredentials: true }) // Passing cookies

        if (res.data.success) {
          setUser(res.data.data.user)
        }

        else {
          setUser(null)
        }

      } catch (error) {
        console.log(error);

      }

    }

    handle_fetch()

  }, [])



  return (
    <>

      <UserContext.Provider value={{ user, setUser }}>

        {children}

      </UserContext.Provider>

    </>
  )
}

export function useUserContext() {

  return useContext(UserContext)

}