import { Metadata } from 'next'
import ClientHomePage from './ClientHomePage'

export const metadata: Metadata = {
  title: 'SMART Leerdoel Creator - Inholland Hogeschool',
  description: 'Een tool voor het creëren van SMART leerdoelen',
}

export default function Home() {
  return <ClientHomePage />
}