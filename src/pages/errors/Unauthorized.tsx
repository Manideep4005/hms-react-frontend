import { useNavigate } from "react-router-dom"

function Unauthorized(){

 const navigate = useNavigate()

 return(

  <div className="h-screen flex items-center justify-center bg-gray-100">

   <div className="bg-white p-10 rounded-lg shadow text-center">

    <h1 className="text-4xl font-bold text-red-500 mb-4">
     401
    </h1>

    <p className="text-gray-600 mb-6">
     You are not authorized. Please login again.
    </p>

    <button
     onClick={()=>navigate("/")}
     className="bg-blue-600 text-white px-5 py-2 rounded"
    >
     Go to Login
    </button>

   </div>

  </div>

 )
}

export default Unauthorized