import { useEffect, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Pill from './components/Pill';

function App() {
  const[searchTerm, setSearchTerm] = useState("");
  // const[users, setUsers] = useState([])
  const[suggestions, setSuggestions] = useState([]);
  const[selectedUsers , setSelectedUsers] = useState([])
  const[selectedUserSet , setSelectedUserSet] = useState(new Set())

  const inputRef = useRef(null)


  const fetchUsers= ()=>{
    if(searchTerm.trim()===""){
      return setSuggestions([])
    }
    fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
    .then((res)=> res.json())
    .then((data)=> setSuggestions(data))
  }

  useEffect(()=>{
    fetchUsers()
  },[searchTerm]);
  console.log("seleected",selectedUsers)

  const handleSelectUser = (user)=>{
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]))
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus()

  }

  const handleRemoveUser = (user)=>{
    const updatedUsers = selectedUsers.filter(
      (selectedUser)=> selectedUser.id !== user.id);
      setSelectedUsers(updatedUsers);
      const updatedEmails = new Set(selectedUserSet);
      updatedEmails.delete(user.email);
      setSelectedUserSet(updatedEmails)

  }

  const handleKeyDown = (e)=>{
    if(e.key === 'Backspace' && e.target.value ==='' && selectedUsers.length >0 ){
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser)
      setSuggestions("")
    }
  }


  return (
    <div className='user-search-container'>
      <div className='user-search-input'>
        {/* Pill component */}
        {
          selectedUsers.map((user)=>{
            return <Pill key={user.email}
            image={user.image}
            text={`${user.firstName} ${user.lastName}`}
            onClick={()=>handleRemoveUser(user)} />
          })
        }


      {/* search input */}
      <div className='searchTerm'>
        <input 
        ref={inputRef}
        type="text"
        value={searchTerm}
        placeholder='search input' 
        onChange={(e)=>setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        />
       
        <ul className='suggestion-list'>
          {suggestions?.users?.map((user,index)=>{
            return !selectedUserSet.has(user.email)?(
                <li key={user.email} onClick={()=>handleSelectUser(user)}>
                  <img src={user.image}
                   alt={`${user.firstName}
                    ${user.lastName} `} 
                    />
                  <span>
                    {user.firstName} {user.lastName}
                    </span>
                </li>
              
            ):<></>
          })}
        </ul>
        

      </div>

    </div>
    </div>
      
  )
}

export default App
