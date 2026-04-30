import { useTheme } from '../../context/ThemeContext';
import { Logo } from '../ui';
import {Twitter , Instagram , Linkedin , Facebook } from 'lucide-react';

const FOOTER_COLS = [
  { title: 'Platform', links: ['Features', 'Restaurants', 'Pricing', 'About'] },
  { title: 'Company', links: ['Blog', 'Careers', 'Press', 'Contact'] },
  { title: 'Legal', links: ['Privacy', 'Terms', 'Cookie Policy', 'Licenses'] },
];

const SOCIAL =[
  {icon: <Twitter size={16}/>, label: 'Twitter' },
  {icon: <Instagram size={16}/>, label: 'Instagram'},
  {icon: <Linkedin size={16}/>, label: 'LinkedIn'},
  {icon: <Facebook size={16}/> , label: 'Facebook'},
];

export default function Footer() {
  const { dark } = useTheme();

  return (
    <footer className={`${dark ? 'bg-[#070B14] border-white/5' : 'bg-white border-black/5'} border-t`}>
      <div className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className={`text-sm mt-4 leading-relaxed max-w-[240px] ${dark ? 'text-white/45' : 'text-gray-500'}`}>
              Powering restaurants with cutting-edge management tools and connecting customers to great food.
            </p>
            <div className='flex gap-3 mt-5'>
              {SOCIAL.map(({ icon, label})=>{
                <button 
                key={label}
                aria-label={label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-base cursor-pointer border-none transition-all duration-200 hover:bg-accent/20 ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
                  {icon}
                </button>
              })}
            </div>
            </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="text-accent font-bold text-sm mb-4">{col.title}</div>
              {col.links.map((link) => (
                <div key={link} className={`text-sm mb-2.5 cursor-pointer transition-colors duration-200 hover:text-accent ${dark ? 'text-white/45' : 'text-gray-500'}`}>
                  {link}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={`border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 ${dark ? 'border-white/5' : 'border-black/5'}`}>
          <p className={`text-xs ${dark ? 'text-white/35' : 'text-gray-400'}`}>
            © 2025 Delicious Food. All rights reserved.
          </p>
          <p className="text-xs text-accent font-medium">Made with ❤️ for great food</p>
        </div>
      </div>
    </footer>
  );
}
