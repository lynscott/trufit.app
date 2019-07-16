/**
 * All layout related constants can go here.
 */


 // Just some breakpoints to keep track of.
export const COLLAPSE_TRIGGER_WIDTH = 769
export const FULL_LAYOUT_WIDTH = 769

// IOS Double Tap Hack
export var DOUBLE_TAP_HACK_STATE = false

export function DOUBLE_TAP_HACK_HANDLER(event, fun) {
    if(!DOUBLE_TAP_HACK_STATE) {
        DOUBLE_TAP_HACK_STATE = true
        setTimeout( function() { DOUBLE_TAP_HACK_STATE = false }, 300 )
        return false
    }
    event.preventDefault()
    fun()
 }