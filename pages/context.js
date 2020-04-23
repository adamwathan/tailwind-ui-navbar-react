import React from 'react'
import { useContext } from 'react'

const MyContext = React.createContext({ flavor: 'chocolate', foo: undefined })

const MyConsumer = () => {
  const { flavor, foo } = useContext(MyContext)
  console.log(foo)
  return <h1>Flavor: {foo}</h1>
}

export default () => {
  return (
    <MyContext.Provider value={{ flavor: 'vanilla', foo: 'bar' }}>
      <MyContext.Provider value={{ flavor: 'mint', foo: undefined }}>
        <MyConsumer />
      </MyContext.Provider>
    </MyContext.Provider>
  )
}
