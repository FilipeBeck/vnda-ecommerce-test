import Wrapper from '../wrapper'
import { Typography } from '@material-ui/core'

export default function Home() {
  return (
    <Wrapper
      top={{
        user: {
          avatar: 'https://scontent.fpoa4-1.fna.fbcdn.net/v/t1.0-9/91825183_2791610260922470_1056639766738501632_o.jpg?_nc_cat=103&_nc_sid=09cbfe&_nc_ohc=MhWEj7wYP1AAX9Gmrao&_nc_ht=scontent.fpoa4-1.fna&oh=1897223fee6b9b6deeec7c3e5027dd2b&oe=5F7893D5',
          email: 'filipe.beck@gmail.com',
          options: []
        },
        searchTerm: null,
        onChangeSearchTerm: () => {}
      }}
    >
      <main>
        <Typography variant="h6">Carts page</Typography>
      </main>
    </Wrapper>
  )
}
