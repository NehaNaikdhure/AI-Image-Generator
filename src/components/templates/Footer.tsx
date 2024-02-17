import React from 'react'

type Props = {}

function Footer({ }: Props) {
  return (
    <div>
      <Author />
    </div>
  )
}

export function Author() {
  return (
    <div className="author" style={{
      position: "fixed",
      bottom: "5px",
      right: "0",
      padding: ".2rem 1rem",
      border: "1px solid #e0e0e0",
      fontWeight: "bold",
      zIndex: 1000
    }}>
      <p>Created by <a href="https://www.linkedin.com/in/neha-naikdhure" >Neha Naikdhure</a>
      </p>
    </div>
  )
}

export default Footer