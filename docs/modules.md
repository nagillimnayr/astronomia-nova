[vr-astro-r3f](README.md) / Exports

# vr-astro-r3f

## Table of contents

### Variables

- [SemiMajorAxis](modules.md#semimajoraxis)

## Variables

### SemiMajorAxis

• `Const` **SemiMajorAxis**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getFromApoapsis` | (`eccentricity`: `number`, `apoapsis`: `number`) => `number` |
| `getFromApsides` | (`apoapsis`: `number`, `periapsis`: `number`) => `number` |
| `getFromLinearEccentricity` | (`eccentricity`: `number`, `linearEccentricity`: `number`) => `number` |
| `getFromPeriapsis` | (`eccentricity`: `number`, `periapsis`: `number`) => `number` |
| `getFromPeriod` | (`period`: `number`, `centralMass`: `number`) => `number` |
| `getFromSpecificOrbitalEnergy` | (`centralMass`: `number`, `specificOrbitalEnergy`: `number`) => `number` |

#### Defined in

[SemiMajorAxis.ts:88](https://github.com/nagillimnayr/vr-astro-r3f/blob/1bbeeb6/src/simulation/math/orbital-elements/axes/SemiMajorAxis.ts#L88)
