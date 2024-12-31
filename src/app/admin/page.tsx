import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

import React from 'react'
import db from '../../db/db'
import { formatCurrency, formatNumber } from '@/lib/formatters'

// import { Average } from 'next/font/google'

//Wait function
function wait (duration: number) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

//function to get sales data from database
async function getSalesData () {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })
  //Intentinal waiting to show after 2 seconds
  await wait(2000)
  //return amount and number of sales
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  }
}

//function to get user data from database
async function getUserData () {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ])

  //return user count and average value per user

  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100
  }
}
//function to get products data from database
async function getProductData () {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } })
  ])
  // Return All Active and non active products
  return {
    activeCount,
    inactiveCount
  }
}
type DashboardCardProps = {
  title: string
  subtitle: string
  text: string
}

async function AdminDashboard () {
  //getting data from database
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ])

  //return dashboard
  return (
    <div className='w-[98%] md:w-[90%] lg:w-[90%] p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto'>
      <DashboardCard
        title='Sales'
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        text={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title='Customers'
        subtitle={`${formatCurrency(
          userData.averageValuePerUser
        )} Average value`}
        text={formatNumber(userData.userCount)}
      />
      <DashboardCard
        title='Products'
        subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
        text={formatNumber(productData.activeCount)}
      />
    </div>
  )
}

function DashboardCard ({ title, subtitle, text }: DashboardCardProps) {
  return (
    <Card className='hover:scale-145 cursor-pointer hover:shadow-2xl hover:bg-primary hover:text-primary-foreground bg-secondary text-secondary-foreground'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  )
}
export default AdminDashboard
