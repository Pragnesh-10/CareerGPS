import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { vi, test, expect } from 'vitest'
import Results from '../pages/Results'
import * as ai from '../services/ai'

vi.spyOn(ai, 'getCareerRecommendations').mockResolvedValue([
  { career: 'Data Scientist', prob: 0.9 },
  { career: 'Backend Developer', prob: 0.6 }
])

const formData = {
  interests: { numbers: true, building: true, design: false, explaining: false, logic: true },
  workStyle: { environment: 'Solo', structure: 'Structured', roleType: 'Desk Job' },
  intent: { afterEdu: 'job', workplace: 'startup', nature: 'applied' },
  confidence: { math: 7, coding: 6, communication: 5 }
}

test('Results shows predicted careers', async () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: '/results', state: { formData } }]}>
      <Routes>
        <Route path="/results" element={<Results />} />
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText(/Analyzing your profile/i)).toBeInTheDocument()

  await waitFor(() => expect(screen.getByText(/Your Perfect Career Matches/i)).toBeInTheDocument(), { timeout: 3000 })

  expect(screen.getByText(/Data Scientist/)).toBeInTheDocument()
  expect(screen.getByText(/Backend Developer/)).toBeInTheDocument()
})