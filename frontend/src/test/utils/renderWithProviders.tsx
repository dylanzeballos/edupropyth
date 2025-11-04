import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'

export function renderWithProviders(
  ui: React.ReactElement,
  opts?: { queryClient?: QueryClient }
) {
  const qc =
    opts?.queryClient ?? new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const Wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={qc}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
  return { ...render(ui, { wrapper: Wrapper }), queryClient: qc }
}
