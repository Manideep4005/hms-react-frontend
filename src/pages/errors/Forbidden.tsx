import { useNavigate } from "react-router-dom"

function Forbidden(){

 const navigate = useNavigate()

 return(

  <div className="h-screen flex items-center justify-center bg-gray-100">

   <div className="bg-white p-10 rounded-lg shadow text-center">

    <h1 className="text-4xl font-bold text-red-500 mb-4">
     403
    </h1>

    <p className="text-gray-600 mb-6">
     You do not have permission to access this page.
    </p>

    <button
     onClick={()=>navigate(-1)}
     className="bg-blue-600 text-white px-5 py-2 rounded"
    >
     Go Back
    </button>

   </div>

  </div>

 )
}

export default Forbidden