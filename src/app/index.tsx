import Anatomy from '@/anatomy'
import { AnatomyEventContextProvider } from '@/shared/events/anatomy-event-context'
import { GlobalStyles } from '@/shared/styles/global'

const App = () => {
  return (
    <AnatomyEventContextProvider>
      <GlobalStyles />
      <Anatomy />
    </AnatomyEventContextProvider>
  )
}

export default App