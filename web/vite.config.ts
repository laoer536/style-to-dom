import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv) => {
  const currentEnv = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [react()],
    base: currentEnv.VITE_PUBLIC_PATH,
  })
}
