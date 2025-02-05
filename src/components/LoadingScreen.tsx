import loader from "../assets/loading_2.gif"

export default function LoadingScreen(){
 return (
  <div>
      <img src={loader} alt="" className='h-[40%] object-cover' />
    </div>
  )
}

// export default LoadingScreen