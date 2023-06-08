const userMenuItems = (userLoggedIn)=> [
    {
      title: 'Start Ups',
      submenu: [
        {
          title: 'How to get Started?',
          url: '/frontend',
        },
        {
          title: 'Model Project Report',
          url: '/backend',
        },
      ],
    },
    {
      title: 'Finance',
      submenu: [
        {
          title: 'bank Finance',
          url: '/bank',
        },
        {
          title: 'Subsidies',
          url: '/Subsidies',
        },
        {
          title: 'funds Calculator',
          url: '/funds',
        },
      ],
    },
    {
      title: 'Loans',
      submenu: [
        {
          title: 'CIBL Score',
          url: '/cibl',
        },
        {
          title: 'Interest Advisor',
          url: '/interest',
        },
      ],
    },
    {
      title: 'Business',
      submenu: [
        {
          title: 'Support',
          url: '/Support',
        },
        {
          title: 'Information',
          url: '/information',
        },
        {
          title: 'FAQ',
          url: '/faq',
        },
      ],
    },
    {
      title : `usersLogin`,
      submenu: userLoggedIn?[
        {
          title: 'Logout',
          url: '/logout',
        },
        {
          title:'User Profile',
          url: '/UserProfile',
        }

      ]
      :[
        {
          title: 'Login',
          url: '/login',
        },
        {
          title: 'Sign Up',
          url: '/register',
        }
      ],
    }
  ]

  export default userMenuItems;