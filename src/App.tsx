import { useEffect } from 'react'
import RootLayout from './layout'
import { useSetAtom } from 'jotai'
import { CATEGORIES, COLORS, SIZES } from './store'
import api from './api'

function App() {

  const setCategories = useSetAtom(CATEGORIES)
  const setColors = useSetAtom(COLORS)
  const setSizes = useSetAtom(SIZES)

  useEffect(() => {
    api.get("/item-type/get").then(res => {
      setCategories(res.data.data)
    })
    api.get("/item-color/get").then(res => {
      setColors(res.data.data)
    })
    api.get("/item-size/get").then(res => {
      setSizes(res.data.data)
    })
  }, [])

  return <RootLayout />
}

export default App
