import React from 'react'

const MessageItem = (props)=>{
    const {Sendername,Time,Message,isI} = props
    let MessageClass =(isI === true ) ? "me" : "you"
    return(
        <li class={MessageClass}>
            <div class="entete">
            <span class="status green"></span>
                <h2>{Sendername}</h2>
                <h3>{Time}</h3>
              </div>
              <div class="triangle"></div>
              <div class="message">
                {Message}
            </div>
        </li>
    )
}

export default MessageItem;