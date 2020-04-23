import { CSSTransition } from 'react-transition-group'
import { useRef, useEffect, useContext } from 'react'

const TransitionContext = React.createContext({
  parent: {},
})

function Transition({
  timeout,
  show,
  enter = '',
  enterFrom = '',
  enterTo = '',
  leave = '',
  leaveFrom = '',
  leaveTo = '',
  appear,
  children,
}) {
  const enterClasses = enter.split(' ').filter((s) => s.length)
  const enterFromClasses = enterFrom.split(' ').filter((s) => s.length)
  const enterToClasses = enterTo.split(' ').filter((s) => s.length)
  const leaveClasses = leave.split(' ').filter((s) => s.length)
  const leaveFromClasses = leaveFrom.split(' ').filter((s) => s.length)
  const leaveToClasses = leaveTo.split(' ').filter((s) => s.length)

  function addClasses(node, classes) {
    classes.length && node.classList.add(...classes)
  }

  function removeClasses(node, classes) {
    classes.length && node.classList.remove(...classes)
  }

  const { parent } = useContext(TransitionContext)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
  }, [])

  const isParent = show !== undefined
  const isChild = !isParent
  const isDefaultOpen = show === true && mounted.current === false
  // const isGroupMounted = isParent ? show : show === true && mounted.current
  const isParentAndDefaultOpen = isParent && isDefaultOpen

  // TO DO: FIGURE OUT HOW TO MAKE PARENT WAIT FOR ALL NESTED TRANSITIONS TO FINISH, NOT JUST FIRST
  // ALTERNATIVELY LET THE USER SPECIFY THE TIMEOUT MANUALLY FOR LEAVE

  /*              Parent
           Mounted
  Child

  */

  const realAppear = isChild ? !parent.defaultedToOpen || parent.appear : appear

  return (
    <TransitionContext.Provider
      value={{
        parent: {
          show: show,
          defaultedToOpen: isParentAndDefaultOpen,
          appear: realAppear,
        },
      }}
    >
      <CSSTransition
        appear={realAppear}
        unmountOnExit
        in={isChild ? parent.show : show}
        addEndListener={(node, done) => {
          if (timeout) {
            setTimeout(done, timeout)
            return
          }
          node.addEventListener('transitionend', done, false)
        }}
        onEnter={(node) => {
          addClasses(node, [...enterClasses, ...enterFromClasses])
        }}
        onEntering={(node) => {
          removeClasses(node, enterFromClasses)
          addClasses(node, enterToClasses)
        }}
        onEntered={(node) => {
          removeClasses(node, [...enterToClasses, ...enterClasses])
        }}
        onExit={(node) => {
          addClasses(node, [...leaveClasses, ...leaveFromClasses])
        }}
        onExiting={(node) => {
          removeClasses(node, leaveFromClasses)
          addClasses(node, leaveToClasses)
        }}
        onExited={(node) => {
          removeClasses(node, [...leaveToClasses, ...leaveClasses])
        }}
      >
        {children}
      </CSSTransition>
    </TransitionContext.Provider>
  )
}

export default Transition
