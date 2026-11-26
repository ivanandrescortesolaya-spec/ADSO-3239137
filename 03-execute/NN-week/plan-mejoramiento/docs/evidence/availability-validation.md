# Manual Availability Validation — Music School

**Date:** 25/11/2026
**Environment:** Isolated application at `http://localhost:5174` connected to the isolated API
**Evidence type:** Operator-performed visual and functional validation
**Database changes during this check:** No new loans were registered.

## Purpose

Record the observed availability indicators and loan-selector behavior before, during, and after category deactivation and reactivation. These observations validate the displayed behavior in the isolated environment; they do not constitute academic approval of category lifecycle functionality.

## Initial State

| Indicator | Observed result |
|---|---:|
| Instrument types | 11 |
| Total physical units | 76 |
| Units eligible for loan | 69 |
| Active loans | 0 |
| Dashboard availability | 90.79% |
| Instruments view availability | 91% (integer rounding) |

## After Deactivating the Strings Category

| Indicator | Observed result |
|---|---:|
| Instrument types | 11 |
| Total physical units | 76 |
| Units eligible for loan | 46 |
| Active loans | 0 |
| Dashboard availability | 60.53% |
| Instruments excluded from the loan selector | `INS-001`, `INS-002` |
| Instruments shown in the selector | 8 |
| Sum of selector units available | 46 |

## After Reactivating the Strings Category

| Indicator | Observed result |
|---|---:|
| Total physical units | 76 |
| Units eligible for loan | 69 |
| Active loans | 0 |
| Dashboard availability | 90.79% |
| `INS-001` selector availability | 15 units |
| `INS-002` selector availability | 8 units |
| Result | Initial availability state restored |

## Browser Translation Observation

A temporary 0% value appeared on the Instruments availability card while Chrome translated the page. In an incognito session without automatic translation, the card displayed 91%. The availability formula in the source was inspected and considered correct. The browser's internal cause for the temporary value was not established, and no code change was made to `Instruments.jsx` for this observation.

## Evidence Limits

- No new loans were registered during this check.
- These results are manual observations, not automated test assertions.
- No screenshots are claimed as stored repository evidence.
- Category activation and deactivation remain a scope extension under review; these observations do not establish instructor approval.
