
'use client'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { increment, decrement } from '@/store/slices/counterSlice'

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="p-4">
      <h2 className="text-lg">Counter: {count}</h2>
      <button onClick={() => dispatch(increment())} className="px-2 py-1 bg-green-500 m-1">+</button>
      <button onClick={() => dispatch(decrement())} className="px-2 py-1 bg-red-500 m-1">-</button>
    </div>
  )
}
