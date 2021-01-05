function run (val, num) {
  let loss
  let acc
  if (val === 1) {
    loss = [
      0.63090158939361572,
      0.51688756585121155,
      0.49303062558174133,
      0.44251964330673218,
      0.36046714872121811,
      0.28329486429691315,
      0.16631346374750137,
      0.10405736297369003,
      0.06184576824307442,
      0.05369441211223602]
    acc = [
      0.8192,
      0.8035,
      0.8352,
      0.64127272605896,
      0.6938181328773499,
      0.7601818227767944,
      0.8834545350074768,
      0.9278181314468384,
      0.9599999594688416,
      0.9834545254707336]

    if (num === 2) {
      loss = [
        0.63090158939361572,
        0.51688756585121155,
        0.49303062558174133,
        0.44251964330673218,
        0.36046714872121811,
        0.28329486429691315,
        0.16631346374750137,
        0.10405736297369003,
        0.06184576824307442,
        0.05369441211223602]
      acc = [
        0.7802,
        0.7393,
        0,
        0.64127272605896,
        0.6938181328773499,
        0.7601818227767944,
        0.8834545350074768,
        0.9278181314468384,
        0.9599999594688416,
        0.9834545254707336]
    }
  }

  if (val === 2) {
    loss = [
      0.63090158939361572,
      0.51688756585121155,
      0.49303062558174133,
      0.44251964330673218,
      0.36046714872121811,
      0.28329486429691315,
      0.16631346374750137,
      0.10405736297369003,
      0.06184576824307442,
      0.05369441211223602]
    acc = [
      0.7600,
      0.7700,
      0.7899,
      0.64127272605896,
      0.6938181328773499,
      0.7601818227767944,
      0.8834545350074768,
      0.9278181314468384,
      0.9599999594688416,
      0.9834545254707336]
    if (num === 2) {
      loss = [
        0.63090158939361572,
        0.51688756585121155,
        0.49303062558174133,
        0.44251964330673218,
        0.36046714872121811,
        0.28329486429691315,
        0.16631346374750137,
        0.10405736297369003,
        0.06184576824307442,
        0.05369441211223602]
      acc = [
        0.7430,
        0.7875,
        0.6107272338867188,
        0.64127272605896,
        0.6938181328773499,
        0.7601818227767944,
        0.8834545350074768,
        0.9278181314468384,
        0.9599999594688416,
        0.9834545254707336]
    }
  }

  return [loss, acc]
}

function sample0 (val) {
  let sample
  if (val === 1) {
    sample = [
      18000,
      12000,
      30000,
      18000,
      12000,
      30000,
      18000,
      12000,
      12000,
      30000]
  }

  if (val === 2) {
    sample = [
      4113,
      2741,
      6854,
      4113,
      2741,
      6854,
      4113,
      2741,
      6854,
      4113,
      2741]
  }

  return [sample]
}

export {
  run,
  sample0
}
