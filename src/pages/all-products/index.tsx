import {
  Link,
  Mail,
  Headphones,
  Users,
  PenTool,
  BookOpen,
  Trello,
  Share2,
  CreditCard,
  Calendar,
  Megaphone,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  DollarSign,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const products = [
  //   {
  //     icon: <Link className="w-8 h-8 text-blue-500" />,
  //     name: 'CRM',
  //     description: 'Comprehensive CRM platform for customer-facing teams.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <Mail className="w-8 h-8 text-yellow-500" />,
  //     name: 'Mail',
  //     description: 'Secure email service for teams of all sizes.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <Headphones className="w-8 h-8 text-green-500" />,
  //     name: 'Desk',
  //     description: 'Helpdesk software to deliver great customer support.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <Users className="w-8 h-8 text-purple-500" />,
  //     name: 'People',
  //     description: 'Organize, automate, and simplify your HR processes.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <PenTool className="w-8 h-8 text-indigo-500" />,
  //     name: 'Creator',
  //     description: 'Build powerful custom applications faster.',
  //     action: 'TRY NOW',
  //   },
  //   {
  //     icon: <BookOpen className="w-8 h-8 text-red-500" />,
  //     name: 'Books',
  //     description: 'Powerful accounting platform for growing businesses.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <Trello className="w-8 h-8 text-orange-500" />,
  //     name: 'Projects',
  //     description: 'Manage, track, and collaborate on projects with teams.',
  //     action: 'ACCESSED',
  //   },
  //   {
  //     icon: <Share2 className="w-8 h-8 text-pink-500" />,
  //     name: 'Connect',
  //     description: 'Team collaboration software that brings people together.',
  //     action: 'ACCESSED',
  //   },
  {
    icon: <DollarSign className='h-8 w-8 text-green-600' />,
    name: 'Payroll',
    description: 'Streamline payroll processes and ensure accurate payments.',
    action: 'TRY NOW',
    path: '/sign-in',
  },
  {
    icon: <UserCheck className='h-8 w-8 text-blue-600' />,
    name: 'EMS',
    description: 'Comprehensive employee management system for HR teams.',
    action: 'TRY NOW',
    path: '/ems/sign-in',
  },
]

const accessedApps = [
  { icon: <CreditCard className='h-8 w-8 text-green-500' />, name: 'Billing' },
  { icon: <BookOpen className='h-8 w-8 text-blue-500' />, name: 'Books' },
  { icon: <Calendar className='h-8 w-8 text-blue-500' />, name: 'Calendar' },
  { icon: <Megaphone className='h-8 w-8 text-red-500' />, name: 'Campaigns' },
]   

export default function ProductShowcase() {
  const navigate = useNavigate()
  return (
    <div className='flex min-h-screen flex-col bg-white pt-16'>
      <header className='fixed top-0 z-50 w-full border-b border-gray-200 bg-white py-4'>
        <div className='borde container mx-auto px-4'>
          <nav className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='flex space-x-1'>
                <div className='h-6 w-6 bg-red-500'></div>
                <div className='h-6 w-6 bg-green-500'></div>
                <div className='h-6 w-6 bg-blue-500'></div>
                <div className='h-6 w-6 bg-yellow-500'></div>
              </div>
              <a href='#' className='text-xl font-bold'>
                ZOHO
              </a>
            </div>
            <div className='hidden space-x-4 md:flex'>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Products
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Customers
              </a>
              <a href='#' className='text-gray-600 hover:text-gray-900'>
                Company
              </a>
              <button className='text-gray-600 hover:text-gray-900'>•••</button>
            </div>
            <div className='flex items-center space-x-4'>
              <button className='text-gray-600 hover:text-gray-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </button>
              <button className='text-gray-600 hover:text-gray-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
                </svg>
              </button>
              <button className='text-gray-600 hover:text-gray-900'>EN</button>
              <button className='text-gray-600 hover:text-gray-900'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className='flex-grow bg-blue-600 py-16'>
        <div className='container mx-auto px-4'>
          <h1 className='mb-4 text-center text-4xl font-bold text-white'>
            Some of our most popular apps
          </h1>
          <p className='mb-12 text-center text-xl text-white'>
            Take your pick—we've got you covered.
          </p>

          <div className='rounded-lg bg-white p-8 shadow-lg'>
            <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
              {products.map((product, index) => (
                <div
                  key={index}
                  className='flex flex-col items-start rounded-lg bg-gray-50 p-4'
                >
                  <div className='mb-4 flex items-center'>
                    {product.icon}
                    <h2 className='ml-2 text-xl font-semibold text-black'>
                      {product.name}
                    </h2>
                  </div>
                  <p className='mb-4 flex-grow text-gray-600'>
                    {product.description}
                  </p>
                  <Button  onClick={() => navigate(product.path, {replace: false})}
                    variant='link'
                    className='text-blue-600 hover:text-blue-800'
                  >
                    {product.action} <span className='ml-1'>→</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-16'>
            <h3 className='mb-8 text-center text-xl font-semibold text-white'>
              Apps you've accessed
            </h3>
            <div className='flex justify-center space-x-8'>
              {accessedApps.map((app, index) => (
                <div key={index} className='flex flex-col items-center'>
                  <div className='mb-2 rounded-full bg-white p-4'>
                    {app.icon}
                  </div>
                  <span className='text-white'>{app.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className='bg-gray-100'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <div>
              <h4 className='mb-4 text-lg font-semibold'>Products</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    CRM
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Mail
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Desk
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    People
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Payroll
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    EMS
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-lg font-semibold'>Company</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Careers
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-lg font-semibold'>Resources</h4>
              <ul className='space-y-2'>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Blog
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Help Center
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Community
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-600 hover:text-gray-900'>
                    Developers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='mb-4 text-lg font-semibold'>Connect with Us</h4>
              <div className='flex space-x-4'>
                <a href='#' className='text-gray-600 hover:text-gray-900'>
                  <Facebook className='h-6 w-6' />
                </a>
                <a href='#' className='text-gray-600 hover:text-gray-900'>
                  <Twitter className='h-6 w-6' />
                </a>
                <a href='#' className='text-gray-600 hover:text-gray-900'>
                  <Linkedin className='h-6 w-6' />
                </a>
                <a href='#' className='text-gray-600 hover:text-gray-900'>
                  <Instagram className='h-6 w-6' />
                </a>
              </div>
            </div>
          </div>
          <div className='mt-8 border-t border-gray-200 pt-8 text-center'>
            <p className='text-gray-600'>
              &copy; {new Date().getFullYear()} MyApps. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
