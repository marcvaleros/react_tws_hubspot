import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

export default function Accordion() {

  const versions = [
    {
      version_title: 'Version 1.1 - October 1X, 2024',
      subtitle: 'Here\'s what\'s new in Version 1.1 ✨:',
      list: [
        {
          title:'Automatic Excel File to CSV Conversion',
          content: 'Users can now upload both CSV and Excel files without the need for manual conversion.'
        },
        {
          title:'Database Integration',
          content: 'User credentials, along with their associated TWS franchisees and configuration settings, are now stored in the database.'
        },
        {
          title: 'Magic Link Authentication',
          content: 'Users can log in or sign up using magic links, enhancing both security and user experience. These links will be sent to the user\'s email and will remain valid for 30 minutes.'
        },
        {
          title: 'Login/Logout System',
          content: 'Users can log in, and their details will be retrieved from the database. Information stored in the website\'s local storage will be automatically cleared upon logout.'
        },
        {
          title: 'JWT Authentication',
          content: 'Unauthorized users without a valid JWT token will be restricted from accessing API requests. The JWT token will remain valid for 3 days, and users will need to re-authenticate via magic link once the token expires.'
        },
        {
          title: 'Role-Based Access Control',
          content: 'There are currently two user roles: Admin and Agent. Admins have access to all pages, including the lists of TWS franchisees and system users.',
          more: [
            'Admins can log in and switch between TWS franchisee configurations, allowing them to import leads to multiple HubSpot accounts associated with those franchisees.', 'Agents are limited to one TWS franchisee and can only upload leads to their designated TWS HubSpot account.'
          ]
        },
        {
          title: 'Zip Code Configuration & Other Filters',
          content: 'Users can set up zip code filter settings to exclude specific territories based on a provided list. Additional filters, such as project types and building uses, can also be configured.'
        },
        {
          title: 'Layout Improvements',
          content: 'A navigation bar has been added to facilitate easy page switching and logout. Some navigation links are visible only to admin users for security reasons'
        },
        {
          title: 'Configurable HubSpot API Key for TWS Franchisee',
          content: 'Admin users can now switch between different TWS accounts, allowing for automatic updates to their HubSpot API key configuration. This enables admins to upload without needing to sign in and out between accounts. The server API will access the HubSpot account of the currently selected TWS franchisee.'
        },
        {
          title: 'Added Release Notes Page',
          content: 'A release notes page has been added to help users track the latest technical features available in the Zachomatic HubSpot Import Tool.'
        },

      ]
    },
    {
      version_title: 'Version 1.0 - September 26, 2024',
      subtitle: 'Here\'s what\'s new in Version 1.0 ✨:',
      list: [
        {
          title: 'CSV File Upload',
          content: 'Users can now upload only CSV file formats. This means they must manually convert other formats (e.g., Excel) to CSV before uploading.'
        },
        {
          title: 'Import to HubSpot via API',
          content: 'Users can seamlessly upload contacts and projects from Construct Connect to HubSpot through the import API, eliminating the need for manual column mapping'
        },
        {
          title: 'Project Creation, Contact & Company Association',
          content: 'A deal object will automatically be created, designated as ‘Upcoming Projects’ by default. This project will be linked to the corresponding contacts and their associated companies.'
        },
        {
          title: 'Filter Summary',
          content: 'After filtering the uploaded file, users will see a summary of the results that includes key information such as the number of valid contacts, invalid contacts, and duplicate contacts.'
        },
        {
          title: 'Progress Bar & Modal Confirmation',
          content: 'When a user initiates the import process, a loading screen featuring a spinning image of our valued team member, Zach, will appear. The progress bar will show real-time processing percentages from the server, enhancing the user experience. Upon successful import, a confirmation modal will be displayed.'
        },

      ]
    },
];

  return (
    <div className="flex-grow flex justify-center items-center my-6 p-4">
      <div className="mx-auto w-full max-w-7xl divide-y divide-white/5 rounded-xl bg-white/5">
        {
          versions && (
            <>
              {
                versions.map((ver, index) => (
                  <Disclosure key={index} as="div" className="p-6" defaultOpen={index=== 0 ? true: false}>
                      <DisclosureButton className="group flex w-full items-center justify-between">
                        <span className="text-start text-sm/6 font-medium text-white group-data-[hover]:text-white/80">
                          <p>{ver.version_title}</p>
                        </span>
                        <ChevronDownIcon className="size-5 fill-white/60 group-data-[hover]:fill-white/50 group-data-[open]:rotate-180" />
                      </DisclosureButton>

                      <DisclosurePanel className="mt-2 text-sm text-white">
                        <p className='underline'>{ver.subtitle}</p>
                        <br></br>
                        <ul className="list-disc ml-5">
                          {
                            ver.list.map((item,index) => (
                              <li key={index} className='font-medium text-white/50'><span className='font-bold text-hs-orange'>{item.title}:</span> {item.content}</li>
                            ))
                          }
                         
                          
                        </ul>
                      </DisclosurePanel>
                </Disclosure>
                ))
                  
              }
            </>
          )
        }


      </div>
    </div>
  );
}
