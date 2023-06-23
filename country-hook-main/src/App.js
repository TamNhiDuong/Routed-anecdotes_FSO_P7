import React, { useState, useEffect } from 'react'
import axios from 'axios'

const baseUrl = 'https://restcountries.com/v3.1/all'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios.get(baseUrl).then(res => {
      const data = res.data
      if (data.length > 0) {
        const matchedCountries = data.filter(country => {
          const countryName = country.name.common.toLowerCase()
          return countryName.includes(name.toLowerCase())
        })

        if (matchedCountries.length > 0) {
          console.log('matchedCountries: ', matchedCountries[0])
          const countryData = matchedCountries[0]
          setCountry({
            found: true,
            data: {
              name: countryData.name.common,
              capital: countryData.capital[0],
              population: countryData.population,
              flag: countryData.flag.svg
            }
          })
        }
        else {
          setCountry({ found: false, data: null })
        }
      }
    })
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`} />
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)
  console.log('country: ', country)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App