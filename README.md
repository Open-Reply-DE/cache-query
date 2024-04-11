## TODOS

- [ ] add default cache and use query integration tests
- [ ] add global sync default cache and use query integration tests
- [ ] variables as query keys.
- [ ] optimistic UI queries
- [ ] storage options -> session, cookie, indexdb etc…
- [ ] Performance optimizations like pagination and lazy loading data
- [ ] Deduping multiple requests for the same data into a single request
- [ ] refetchOnReconnect, refetchInterval
- [ ] retry mechanism
- [ ] structural sharing
- [ ] dependent queries
```javascript
   let userId = null;
    useQuery(['user', email], getUserByEmail, {
     onSuccess: (user) => {
             userId = user.id;
         },
     })
    useQuery(['projects', userId], getProjectsByUser,
    {
         // The query will not execute until the userId exists
         enabled: !!userId,
     }
    )
 ```
- [ ] refetchInterval number | false
- [ ] refetchIntervalInBackground boolean
- [ ] refetchOnMount boolean
- [ ] refetchOnReconnect boolean


## Fetching Indicators

- isLoading: indicates a hard state reload
- isFetching: indicates a background state reload, where initial data is still available through cache
